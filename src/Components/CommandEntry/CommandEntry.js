import { Input, InputGroup } from "@chakra-ui/react";

function CommandEntry(props) {
  const { handleKeyUp } = props;
  return (
    <InputGroup>
      <Input
        onKeyUp={handleKeyUp}
        variant="filled"
        type="text"
        placeholder="Enter Commands Here"
      />
    </InputGroup>
  );
}

export default CommandEntry;
