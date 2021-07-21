import { Request } from 'express';
import Frete from 'frete';

import { Dimension } from '@prisma/client';

import { IItemsRepository } from '@v1/repositories';
import { SqliteItemsRepository } from '@v1/repositories/implementations';

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

class getShippingService {
	constructor(private itemsRepository: IItemsRepository) {}

	async execute({ query }: Request) {
		try {
			const id = String(query.id);
			const postal_code = String(query.postal_code);

			const item: itemResponse = await this.itemsRepository.findById(Number(id));
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

			return {
				shipping: {
					shipping_price: shipping_price,
					shipping_date: date.getTime(),
				},
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default async (request: Request) => {
	try {
		const ItemsRepository = new SqliteItemsRepository();
		const getShipping = new getShippingService(ItemsRepository);

		const { shipping } = await getShipping.execute(request);

		return {
			status: 200,
			shipping,
		};
	} catch (error) {
		return {
			error: true,
			status: 400,
			message: error.message,
		};
	}
};
