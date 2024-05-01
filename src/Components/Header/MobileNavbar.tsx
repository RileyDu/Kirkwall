import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerProps,
  Stack,
} from "@chakra-ui/react";

export const MobileDrawer = (props: Omit<DrawerProps, "children">) => (
  <Drawer placement="top" {...props}>
    <DrawerContent  bgGradient="linear(to-br, #052C42, #034C6A)" mt={"2rem"} color={"goldenrod"}>
      <DrawerBody mt="16">
        <Stack spacing="6" align="stretch">
          {["Components","Support"].map((item) => (
            <Button key={item} size="lg" variant="text" colorScheme="gray">
              {item}
            </Button>
          ))}
          <Button bg={"goldenrod"} color={"black"}>
            Contact us
          </Button>
        </Stack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);
