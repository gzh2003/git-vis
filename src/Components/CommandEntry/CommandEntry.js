import { Input, InputLeftAddon, InputGroup } from "@chakra-ui/react";

function CommandEntry(props) {
  const { handleKeyUp } = props;
  return (
    <InputGroup>
      <InputLeftAddon color="grey" children=">" />
      <Input
        onKeyUp={handleKeyUp}
        variant="outline"
        type="text"
        placeholder="Enter Commands Here"
      />
    </InputGroup>
  );
}

export default CommandEntry;
