import React from 'react';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, Tooltip } from '@chakra-ui/react';

// Mapping of time periods to numeric values
const TIME_PERIODS = ['1H', '3H', '6H', '12H', '1D', '3D', '1W'];
const TIME_PERIOD_VALUES = TIME_PERIODS.map((_, index) => index * (100 / (TIME_PERIODS.length - 1))); // Map to a percentage range

function TimeSlider({ defaultValue, onChangeEnd }) {
  const [sliderValue, setSliderValue] = React.useState(defaultValue);
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Find the closest time period based on the slider value
  const getClosestTimePeriod = (value) => {
    const index = Math.round((value / 100) * (TIME_PERIODS.length - 1));
    return TIME_PERIODS[index];
  };

  return (
    <Slider
      id="time-slider"
      defaultValue={defaultValue}
      min={0}
      max={100}
      step={null} // Disables stepping, slider will only snap to the defined values
      colorScheme="teal"
      onChange={(v) => setSliderValue(v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onChangeEnd={(value) => onChangeEnd(getClosestTimePeriod(value))}
    >
      {TIME_PERIOD_VALUES.map((value, index) => (
        <SliderMark key={value} value={value} mt="1" ml="-2.5" fontSize="sm">
          {TIME_PERIODS[index]}
        </SliderMark>
      ))}
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg="teal.500"
        color="white"
        placement="top"
        isOpen={showTooltip}
        label={getClosestTimePeriod(sliderValue)}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
}

export default TimeSlider;
