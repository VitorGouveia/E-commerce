import { Request } from 'express';

import {
	ICartRepository,
	IItemsRepository,
	IOrderRepository,
	IUsersRepository,
} from '@v1/repositories';
import {
	SqliteCartRepository,
	SqliteItemsRepository,
	SqliteOrderRepository,
	SqliteUsersRepository,
} from '@v1/repositories/implementations';

import Frete from 'frete';

import { Address } from '@prisma/client';
import { Order } from '@v1/entities';

type FreteResponse = {
	codigo: number;
	valor: string;
	prazoEntrega: string;
	valorMaoPropria: string;
	valorAvisoRecebimento: string;
	valorValorDeclarado: string;
	entregaDomiciliar: 'S' | 'N';
	entregaSabado: 'S' | 'N';
	erro: string;
	msgErro: string;
	valorSemAdicionais: string;
	obsFim: string;
	name: string;
};

type userResponse = {
	id: string;
	created_at: number;
	admin: boolean | null;
	shadow_ban: boolean | null;
	ban: boolean | null;
	reason_for_ban: string | null;
	token_version: number;
	failed_attemps: number;
	confirmed: boolean | null;
	ip: string;
	name: string;
	lastname: string | null;
	username: string;
	userhash: string;
	cpf: string | null;
	email: string;
	password: string;
	address?: Address[];
};

class CheckoutService {
	constructor(
		private itemsRepository: IItemsRepository,
		private cartRepository: ICartRepository,
		private orderRepository: IOrderRepository,
		private usersRepository: IUsersRepository
	) {}

	async execute(id: string, { query }: Request) {
		try {
			const address_id = Number(query.address_id);
			const payment_id = Number(query.payment_id);
			const item_id = Number(query.item_id);

			// One item checkout - could create a hook that does this.
			const user: userResponse = await this.usersRepository.findById(id);
			const userAddress = user.address!.find((address: Address) => address.id === address_id);

			const postal_code = userAddress!.postal_code.split('-').join('');

			// single-item checkout
			if (!!item_id === true) {
				const item = await this.itemsRepository.findById(Number(item_id));
				if (!item) throw new Error("This item doesn't exist.");

				const [{ valor, prazoEntrega }]: FreteResponse[] = await Frete()
					.cepOrigem('02228240')
					.cepDestino(postal_code)
					.peso(1)
					.formato(Frete.formatos.caixaPacote)
					.comprimento(27)
					.altura(8)
					.largura(10)
					.diametro(18)
					.maoPropria('N')
					.valorDeclarado(item.price / 100)
					.avisoRecebimento('S')
					.servico(Frete.servicos.sedex)
					.precoPrazo('13466321'); // 01/01/1970;

				const shipping_price = Number(valor.split(',').join(''));

				var date = new Date();
				date.setDate(date.getDate() + Number(prazoEntrega));

				const percentagePrice = Math.floor(item.discount / 100);
				if (percentagePrice === 0) {
					const order = new Order({
						user_id: id,
						address_id,
						item_id,
						payment_id,
						shipping_price,
						all_items_price: item.price,
					});

					await this.orderRepository.save(order);

					return {
						prices: {
							price: item.price,
							shipping: {
								shipping_price,
								shipping_date: date.getTime(),
							},
						},
					};
				}

				const price = item.price - percentagePrice * item.price;

				const order = new Order({
					user_id: id,
					address_id,
					item_id,
					payment_id,
					shipping_price,
					all_items_price: price,
				});

				await this.orderRepository.save(order);

				return {
					prices: {
						price,
						shipping: {
							shipping_price,
							shipping_date: date.getTime(),
						},
					},
				};
			}

			// get user address and use it on frete API, get the shipping price and add on the item price
			const cart = await this.cartRepository.list({ user_id: id });
			if (cart.length === 0) throw new Error('Your cart is empty.');

			var itemPrices: number[] = [];
			var itemShipping: number[] = [];
			var items: Object[] = [];

			for (const { item_id } of cart) {
				try {
					const item = await this.itemsRepository.findById(item_id);
					if (!item) throw new Error('Item on your cart is no longer valid.');

					const [{ valor, prazoEntrega }]: FreteResponse[] = await Frete()
						.cepOrigem('02228240')
						.cepDestino(postal_code)
						.peso(1)
						.formato(Frete.formatos.caixaPacote)
						.comprimento(27)
						.altura(8)
						.largura(10)
						.diametro(18)
						.maoPropria('N')
						.valorDeclarado(item.price / 10)
						.avisoRecebimento('S')
						.servico(Frete.servicos.sedex)
						.precoPrazo('13466321');

					const shipping_price = Number(valor.split(',').join(''));

					const date = new Date();
					date.setDate(date.getDate() + Number(prazoEntrega));

					items.push({
						item_id: item.id,
						price: item.price,
						shipping: {
							shipping_price,
							shipping_date: date,
						},
					});

					const percentagePrice = Math.floor(item.discount / 100);
					if (percentagePrice === 0) {
						// validate if address, payment exist
						const order = new Order({
							user_id: id,
							address_id,
							item_id: item_id,
							payment_id,
							shipping_price,
							all_items_price: item.price,
						});

						await this.orderRepository.save(order);

						itemShipping.push(shipping_price);
						itemPrices.push(item.price);
					} else {
						const price: number = item.price - percentagePrice * item.price;

						const order = new Order({
							user_id: id,
							address_id,
							item_id: item_id,
							payment_id,
							shipping_price,
							all_items_price: item.price,
						});

						await this.orderRepository.save(order);

						itemPrices.push(shipping_price);
						itemPrices.push(price);
					}
				} catch (error) {
					throw new Error(error.message);
				}
			}

			await this.cartRepository.delete(id);

			const add = (a: number, b: number) => a + b;
			const prices = itemPrices.reduce(add);
			const shipping = itemShipping.reduce(add);

			return {
				prices: {
					total: prices,
					total_shipping: shipping,
					items,
				},
			};
		} catch (error) {
			console.log(error.message);

			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	try {
		const itemsRepository = new SqliteItemsRepository();
		const cartRepository = new SqliteCartRepository();
		const orderRepository = new SqliteOrderRepository();
		const usersRepository = new SqliteUsersRepository();

		const checkout = new CheckoutService(
			itemsRepository,
			cartRepository,
			orderRepository,
			usersRepository
		);

		const { prices } = await checkout.execute(request.params.id, request);

		return {
			status: 200,
			message: 'Checkout successful!',
			prices,
		};
	} catch (error) {
		return {
			status: 400,
			error: true,
			message: error.message,
		};
	}
};
