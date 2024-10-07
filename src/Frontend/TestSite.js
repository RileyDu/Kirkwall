import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Grid,
  Text,
  Button,
  CircularProgress,
  Input,
} from '@chakra-ui/react';

const TestSite = () => {
  const [query, setQuery] = useState(''); // State for search query
  const [results, setResults] = useState([]); // State for storing search results
  const [loading, setLoading] = useState(false); // State for showing loading indicator
  const [error, setError] = useState(null); // State for handling errors

  // Function to search for equipment by making an API request to the backend
  const searchEquipment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/scrape', {
        params: { query },
      });
      setResults(response.data); // Set the results from the backend
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth="md"
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      style={{
        marginTop: '100px',
        marginLeft: 'auto', // Centers horizontally
        marginRight: 'auto', // Centers horizontally
        padding: '20px', // Optional padding
      }}
    >
      <Heading variant="h4" mb={4}>
        AgScrapper: Agriculture Equipment Search
      </Heading>

      {/* Search Input */}
      <Input
        variant="outlined"
        label="Enter equipment type..."
        fullWidth
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ marginBottom: '20px' }}
        color={'black'}
      />

      {/* Search Button */}
      <Button
        variant="blue"
        onClick={searchEquipment}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Search'}
      </Button>

      {/* Error Handling */}
      {error && (
        <Text color="error" style={{ marginTop: '20px' }}>
          {error}
        </Text>
      )}

      {/* Display Search Results */}
      <Grid container spacing={2} style={{ marginTop: '30px' }}>
        {results.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Box>
              <Box>
                <Text variant="h6" gutterBottom>
                  {item.equipmentName}
                </Text>
                <Text variant="body2" color="textSecondary" gutterBottom>
                  {item.price}
                </Text>
                <Button
                  variant="outlined"
                  color="primary"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Auction Site
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TestSite;
