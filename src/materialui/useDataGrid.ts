import { enUS, esES } from '@mui/x-data-grid/locales';
import useLocalization from '../localization/useLocalization';

const useDataGrid = () => {
  const { getLanguage } = useLocalization();
  const language = getLanguage();
  const localeText = (() => {
    if (language === 'es') return esES.components.MuiDataGrid.defaultProps.localeText;
    return enUS.components.MuiDataGrid.defaultProps.localeText;
  })();
  return { localeText };
};

export default useDataGrid;
