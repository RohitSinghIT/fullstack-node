import { createConfig } from './createConfig';
import { updateConfig } from './updateConfig';
import { deleteConfig } from './deleteConfig';
import { bulkUpdateConfigs } from './bulkUpdateConfigs';
import { getOrCreateConfig } from './getOrCreateConfig';

export const configsMutations = {
  createConfig,
  updateConfig,
  deleteConfig,
  bulkUpdateConfigs,
  getOrCreateConfig
};
