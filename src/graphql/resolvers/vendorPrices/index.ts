import { createVendorPrice } from './mutations/createVendorPrice';
import { updateVendorPrice } from './mutations/updateVendorPrice';
import { deleteVendorPrice } from './mutations/deleteVendorPrice';
import { getVendorPrices } from './queries/getVendorPrices';
import { getVendorPrice } from './queries/getVendorPrice';
import { getPricesByVendorProduct } from './queries/getPricesByVendorProduct';

export const vendorPriceResolvers = {
  Query: {
    vendorPrices: getVendorPrices,
    vendorPrice: getVendorPrice,
    pricesByVendorProduct: getPricesByVendorProduct,
  },
  Mutation: {
    createVendorPrice,
    updateVendorPrice,
    deleteVendorPrice,
  },
}; 