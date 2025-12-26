// src/context/index.js

/**
 * Context Barrel Export
 * Central export point untuk semua contexts
 */

export {
  CipherContext,
  CipherProvider,
  useCipher,
} from './CipherContext';

export {
  StatisticsContext,
  StatisticsProvider,
  useStatistics,
} from './StatisticsContext';

// Combined Provider Component
import { CipherProvider } from './CipherContext';
import { StatisticsProvider } from './StatisticsContext';
import PropTypes from 'prop-types';

/**
 * AppProviders - Wraps all context providers
 * Usage: Wrap your app with this component
 */
export const AppProviders = ({ children }) => {
  return (
    <CipherProvider>
      <StatisticsProvider>
        {children}
      </StatisticsProvider>
    </CipherProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;