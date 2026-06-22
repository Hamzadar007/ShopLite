import { Dimensions, PixelRatio } from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let orientationSubscription;

const widthPercentageToDP = (widthPercent) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);

  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

const heightPercentageToDP = (heightPercent) => {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);

  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

const listenOrientationChange = (that) => {
  orientationSubscription?.remove();
  orientationSubscription = Dimensions.addEventListener('change', (newDimensions) => {
    screenWidth = newDimensions.window.width;
    screenHeight = newDimensions.window.height;

    that.setState({
      orientation: screenWidth < screenHeight ? 'portrait' : 'landscape',
    });
  });
};

const removeOrientationListener = () => {
  orientationSubscription?.remove();
  orientationSubscription = undefined;
};

function normalize(size, based = 'width') {
  const scale = based === 'height' ? screenHeight / 896 : screenWidth / 414;
  const newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const widthPixel = (size) => normalize(size, 'width');
const heightPixel = (size) => normalize(size, 'height');
const fontPixel = (size) => heightPixel(size);
const isTablet = screenWidth >= 768;

export {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange,
  removeOrientationListener,
  fontPixel,
  widthPixel,
  heightPixel,
  isTablet,
};
