import { getSettingsConsent } from './settingsConsent';
import useInMemoryPersistence from './useInMemoryPersistence';
import useInStoragePersistence from './useInStoragePersistence';

const usePersistence = () => (getSettingsConsent()
  ? useInStoragePersistence() : useInMemoryPersistence());

export default usePersistence;
