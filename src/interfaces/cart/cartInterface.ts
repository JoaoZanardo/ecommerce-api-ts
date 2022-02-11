export interface ICart {
	user_id: string;
	products: {
		product_id: string;
		qtd: number;
	}[];
}

export interface ICartService {
	errors: string[];
	addProduct(): void;
	removeProduct(): void;
	removeQtdProduct(): void;
}
