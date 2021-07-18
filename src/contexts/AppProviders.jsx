import { PouchDB } from "react-pouchdb";
import { SnackbarProvider } from "notistack";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import ReteProvider from "./Rete";
import PubSubProvider from "./PubSub";
import SpellProvider from "./Spell";
import LayoutProvider from "./Layout";
import DatabaseProvider from "./Database";
import TabManagerProvider from "./TabManager";

const darkTheme = createTheme({
  palette: {
    type: "dark",
  },
});

const providers = [
  [SnackbarProvider, { maxSnack: 3 }],
  DatabaseProvider,
  [ThemeProvider, { theme: darkTheme }],
  PubSubProvider,
  [PouchDB, { name: "thoth" }],
  ReteProvider,
  SpellProvider,
  LayoutProvider,
  TabManagerProvider,
];

/**
 * Provided that a list of providers [P1, P2, P3, P4] is passed as props,
 * it renders
 *
 *    <P1>
        <P2>
          <P3>
            <P4>
              {children}
            </P4>
          </P3>
        </P2>
      </P1>
 *
 */

function ComposeProviders({ providers, children }) {
  const _providers = [...providers].reverse();
  return _providers.reduce((acc, current) => {
    const [Provider, props] = Array.isArray(current)
      ? [current[0], current[1]]
      : [current, {}];

    return <Provider {...props}>{acc}</Provider>;
  }, children);
}

// Centralize all our providers to avoid nesting hell.
const AppProviders = ({ children }) => (
  <ComposeProviders providers={providers}>{children}</ComposeProviders>
);

export default AppProviders;
