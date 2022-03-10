import GraphVis from "./Components/GraphVis/GraphVis";
import { ChakraProvider, Center } from "@chakra-ui/react";
import theme from "./utils/theme/theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Center w="100vw" bg="#f4f4f5">
        <GraphVis />
      </Center>
    </ChakraProvider>
  );
}

export default App;
