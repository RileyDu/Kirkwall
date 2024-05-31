import { Box, Heading } from "@chakra-ui/react";
import TempBarGraph from "../Charts/TempBarChart";

export default function TempSensors() {
    return (
    <Box p="4" width={"100%"} height={"100%"}>
        <Heading size="lg" textAlign={"center"}>Temperature Sensors</Heading>
        <TempBarGraph />
    </Box>
    
    );
}