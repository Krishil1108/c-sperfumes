import { productType } from './product';
import { siteSettingsType } from './siteSettings';
import order from './order';

export const schema = {
  types: [productType, siteSettingsType, order],
};
