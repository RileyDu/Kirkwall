import {
    Box,
    Heading,
    Grid,
    GridItem,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
    import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  
  // 2. Register Chart.js modules
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  const BioWorx = () => {
    const cardBg = useColorModeValue('gray.500', 'gray.800');
    const cardShadow = useColorModeValue('md', 'dark-lg');
  
    const [mockData, setMockData] = useState([]);
  
    // Fetch mock data from the backend
    useEffect(() => {
      const fetchMockData = async () => {
        try {
          const response = await axios.get('/api/mockdata');
          setMockData(response.data);
          console.log('this is the mock data', response.data);
        } catch (error) {
          console.error('Error fetching mock data:', error);
        }
      };
  
      fetchMockData();
    }, []);
  
    // 3. Transform the mockData into chart-friendly format
    //    - The labels will come from timestamps
    //    - We’ll parse numeric values from the strings in var1, var2, etc.
    const chartLabels = mockData.map(item => {
      const date = new Date(item.timestamp);
  
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      // Only keep the last two digits of the year
      const year = date.getFullYear().toString().slice(-2);
  
      return `${hours}:${minutes} (${day}/${month})`;
    });
  
    // Master list of variable fields we want to chart
    const variableNames = [
      'var1',
      'var2',
      'var3',
      'var4',
      'var5',
      'var6',
      'var7',
      'var8',
      'var9',
      'var10',
      'var11',
    ];
  
    // 4. Define the colors for each variable (same as combined chart)
    //    Key is the variable name, and value is an object containing
    //    borderColor + backgroundColor
    const variableColors = {
        var1: {
          borderColor: 'rgba(230, 25, 75, 0.8)',  // Red
          backgroundColor: 'rgba(230, 25, 75, 0.2)',
        },
        var2: {
          borderColor: 'rgba(60, 180, 75, 0.8)',  // Green
          backgroundColor: 'rgba(60, 180, 75, 0.2)',
        },
        var3: {
          borderColor: 'rgba(255, 225, 25, 0.8)', // Yellow
          backgroundColor: 'rgba(255, 225, 25, 0.2)',
        },
        var4: {
          borderColor: 'rgba(67, 99, 216, 0.8)',  // Blue
          backgroundColor: 'rgba(67, 99, 216, 0.2)',
        },
        var5: {
          borderColor: 'rgba(245, 130, 49, 0.8)', // Orange
          backgroundColor: 'rgba(245, 130, 49, 0.2)',
        },
        var6: {
          borderColor: 'rgba(145, 30, 180, 0.8)', // Purple
          backgroundColor: 'rgba(145, 30, 180, 0.2)',
        },
        var7: {
          borderColor: 'rgba(66, 212, 244, 0.8)', // Cyan
          backgroundColor: 'rgba(66, 212, 244, 0.2)',
        },
        var8: {
          borderColor: 'rgba(240, 50, 230, 0.8)', // Magenta
          backgroundColor: 'rgba(240, 50, 230, 0.2)',
        },
        var9: {
          borderColor: 'rgba(191, 239, 69, 0.8)', // Lime
          backgroundColor: 'rgba(191, 239, 69, 0.2)',
        },
        var10: {
          borderColor: 'rgba(250, 190, 212, 0.8)', // Pink
          backgroundColor: 'rgba(250, 190, 212, 0.2)',
        },
        var11: {
          borderColor: 'rgba(70, 153, 144, 0.8)', // Teal
          backgroundColor: 'rgba(70, 153, 144, 0.2)',
        },
      };
      
  
    // 5. Master chart with ALL variables
    const dataForChart = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Var1',
          data: mockData.map((item) => parseFloat(item.var1)),
          ...variableColors.var1,
        },
        {
          label: 'Var2',
          data: mockData.map((item) => parseFloat(item.var2)),
          ...variableColors.var2,
        },
        {
          label: 'Var3',
          data: mockData.map((item) => parseFloat(item.var3)),
          ...variableColors.var3,
        },
        {
          label: 'Var4',
          data: mockData.map((item) => parseFloat(item.var4)),
          ...variableColors.var4,
        },
        {
          label: 'Var5',
          data: mockData.map((item) => parseFloat(item.var5)),
          ...variableColors.var5,
        },
        {
          label: 'Var6',
          data: mockData.map((item) => parseFloat(item.var6)),
          ...variableColors.var6,
        },
        {
          label: 'Var7',
          data: mockData.map((item) => parseFloat(item.var7)),
          ...variableColors.var7,
        },
        {
          label: 'Var8',
          data: mockData.map((item) => parseFloat(item.var8)),
          ...variableColors.var8,
        },
        {
          label: 'Var9',
          data: mockData.map((item) => parseFloat(item.var9)),
          ...variableColors.var9,
        },
        {
          label: 'Var10',
          data: mockData.map((item) => parseFloat(item.var10)),
          ...variableColors.var10,
        },
        {
          label: 'Var11',
          data: mockData.map((item) => parseFloat(item.var11)),
          ...variableColors.var11,
        },
      ],
    };
  
    // 6. Reuse the same options for both the master chart and individual charts
    const options = {
      responsive: true,
      plugins: {
        legend: {
          // Make sure the legend is displayed
          display: true,
          // Optionally position the legend
          position: 'top',
          
          // OPTIONAL: if you want to customize the onClick behavior
          onClick: (e, legendItem, legend) => {
            // The default behavior toggles dataset visibility
            const index = legendItem.datasetIndex;
            const chart = legend.chart;
    
            // Toggle dataset visibility
            chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    
            // Update the chart
            chart.update();
          },
          onHover: (event) => {
            // Change the cursor to pointer when hovering over legend items
            event.native.target.style.cursor = 'pointer';
          },
          onLeave: (event) => {
            // Revert cursor back when no longer hovering
            event.native.target.style.cursor = 'default';
          },
          labels: {
            color: 'white',
          },
        },
        title: {
          display: false,
          text: 'Example Chart using mockData',
          color: 'white',
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'white',
            autoSkip: true,
            maxTicksLimit: 10,
          },
          title: {
            display: true,
            text: 'Timestamp',
            color: 'white',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)', // set a contrasting color
          },
        },
        y: {
          ticks: {
            color: 'white',
          },
          title: {
            display: true,
            text: 'Values',
            color: 'white',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)', // set a contrasting color
          },
        },
      },
    };
  
    // 7. Build the single-variable charts, reusing the same color style
    const singleVariableCharts = variableNames.map((varName) => {
      const { borderColor, backgroundColor } = variableColors[varName];
  
      return {
        label: varName,
        data: mockData.map((item) => parseFloat(item[varName])),
        borderColor,
        backgroundColor,
      };
    });
  
    return (
      <Box
        mx="auto"
        mt={16}
        px={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading mb={6} textAlign="center" size="xl" fontWeight="bold">
          Dakota BioWorx Mock Data
        </Heading>
  
        {/* BIG CHART with ALL variables */}
        <Box
          width={{ base: '100%', md: '80%' }}
          bg={cardBg}
          p={4}
          shadow={cardShadow}
          mb={10}
        >
          {mockData.length > 0 ? (
            <Line data={dataForChart} options={options} />
          ) : (
            <Heading size="md" textAlign="center">
              Loading chart...
            </Heading>
          )}
        </Box>
  
        {/* GRID of charts where each variable is separate */}
        <Heading mb={4} size="lg" textAlign="center">
          Individual Variable Charts
        </Heading>
  
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
          }}
          gap={6}
          width="100%"
        >
          {mockData.length > 0 ? (
            singleVariableCharts.map((singleDataset) => {
              const singleData = {
                labels: chartLabels,
                datasets: [singleDataset],
              };
  
              return (
                <GridItem
                  key={singleDataset.label}
                  bg={cardBg}
                  p={4}
                  shadow={cardShadow}
                  borderRadius="md"
                >
                  <Heading size="md" mb={2} textAlign="center" color="white">
                    {singleDataset.label}
                  </Heading>
                  <Line data={singleData} options={options} />
                </GridItem>
              );
            })
          ) : (
            <GridItem colSpan={3}>
              <Heading size="md" textAlign="center">
                Loading individual variable charts...
              </Heading>
            </GridItem>
          )}
        </Grid>
      </Box>
    );
  };
  
  export default BioWorx;
  