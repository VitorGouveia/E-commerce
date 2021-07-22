import { Request } from 'express';

import {
	ICartRepository,
	ICouponRepository,
	IItemsRepository,
	IOrderRepository,
	IUsersRepository,
} from '@v1/repositories';
import {
	SqliteCartRepository,
	SqliteCouponRepository,
	SqliteItemsRepository,
	SqliteOrderRepository,
	SqliteUsersRepository,
} from '@v1/repositories/implementations';

import Frete from 'frete';

import { Address, Dimension } from '@prisma/client';
import { Coupon, Order } from '@v1/entities';

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

type itemResponse = {
	id: number;
	created_at: number;
	name: string;
	brand: string | null;
	short_name: string;
	description: string;
	price: number;
	shipping_price: number;
	discount: number;
	category: string;
	dimension?: Dimension;
};

class CheckoutService {
	constructor(
		private itemsRepository: IItemsRepository,
		private cartRepository: ICartRepository,
		private orderRepository: IOrderRepository,
		private usersRepository: IUsersRepository,
		private couponRepository: ICouponRepository
	) {}

	async execute(id: string, { query }: Request) {
		try {
			const address_id = Number(query.address_id);
			const payment_id = Number(query.payment_id);
			const coupon_code = query.coupon_code;
			const item_id = Number(query.item_id);

			// One item checkout - could create a hook that does this.
			const user: userResponse = await this.usersRepository.findById(id);
			const userAddress = user.address!.find((address: Address) => address.id === address_id);

			var discount: number = 0;
			if (!!coupon_code === true) {
				const couponInfo = await this.couponRepository.findByCode(String(coupon_code));
				if (!couponInfo) throw new Error('Could not find that coupon.');

				//check coupon date
				const now_date = new Date().getTime();
				const expire_date = new Date(couponInfo.expire_date).getTime();

				if (now_date > expire_date) throw new Error('The coupon has expired.');

				discount = couponInfo.value;
			}
			const postal_code = userAddress!.postal_code.split('-').join('');

			// single-item checkout
			if (!!item_id === true) {
				const item: itemResponse = await this.itemsRepository.findById(Number(item_id));
				if (!item) throw new Error("This item doesn't exist.");

				const [{ valor, prazoEntrega }]: FreteResponse[] = await Frete()
					.cepOrigem('02228240')
					.cepDestino(postal_code)
					.peso(item.dimension?.weight!)
					.formato(Frete.formatos.caixaPacote)
					.comprimento(item.dimension?.length!)
					.altura(item.dimension?.height!)
					.largura(item.dimension?.width!)
					.diametro(item.dimension?.diameter!)
					.maoPropria('N')
					.valorDeclarado(item.price / 100)
					.avisoRecebimento('S')
					.servico(Frete.servicos.sedex)
					.precoPrazo('13466321'); // 01/01/1970;

				const shipping_price = Number(valor.split(',').join(''));

				var date = new Date();
				date.setDate(date.getDate() + Number(prazoEntrega));

				const percentagePrice = Math.floor(discount / 100);
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
							discount: `${discount}%`,
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
						discount: `${discount}%`,
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
					const item: itemResponse = await this.itemsRepository.findById(item_id);
					if (!item) throw new Error('Item on your cart is no longer valid.');

					const [{ valor, prazoEntrega }]: FreteResponse[] = await Frete()
						.cepOrigem('02228240')
						.cepDestino(postal_code)
						.peso(item.dimension?.weight!)
						.formato(Frete.formatos.caixaPacote)
						.comprimento(item.dimension?.length!)
						.altura(item.dimension?.height!)
						.largura(item.dimension?.width!)
						.diametro(item.dimension?.diameter!)
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

					const percentagePrice = Math.floor(discount / 100);
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
					discount: `${discount}%`,
					items,
				},
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	const itemsRepository = new SqliteItemsRepository();
	const cartRepository = new SqliteCartRepository();
	const orderRepository = new SqliteOrderRepository();
	const usersRepository = new SqliteUsersRepository();
	const couponRepository = new SqliteCouponRepository();

	const checkout = new CheckoutService(
		itemsRepository,
		cartRepository,
		orderRepository,
		usersRepository,
		couponRepository
	);

	const { prices } = await checkout.execute(request.params.id, request);

	return {
		status: 200,
		message: 'Checkout successful!',
		prices,
	};
};
