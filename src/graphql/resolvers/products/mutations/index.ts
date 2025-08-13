import { createProduct } from './createProduct';
import { updateProduct } from './updateProduct';
import { deleteProduct } from './deleteProduct';
import { addProductToCategory } from './addProductToCategory';
import { removeProductFromCategory } from './removeProductFromCategory';

export const productMutations = {
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToCategory,
  removeProductFromCategory,
};
