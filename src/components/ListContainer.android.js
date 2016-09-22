var React = require('React')
var ViewPager = require('./ViewPager')
import NavBar from 'react-native-navigationbar'
import SegmentTab from './SegmentTab'
import {
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  Animated,
  StyleSheet
} from 'react-native'

type Props = {
  androidTitle: string;
  selectedSegment?: number;
  actionName: string;
  actionFunc: func;
  selectedSectionColor: string;
  backgroundImage: number;
  backgroundColor: string;
  parallaxContent?: ?ReactElement;
  stickyHeader?: ?ReactElement;
  onSegmentChange?: (segment: number) => void;
  needTransitionTitle: bool;
  children?: any;
};

type State = {
  idx: number;
  anim: Animated.Value;
  stickyHeaderHeight: number;
};

export const EMPTY_CELL_HEIGHT = Dimensions.get('window').height > 600 ? 200 : 15
export default class extends React.Component {
  props: Props;
  state: State;
  _pinned: any;

  static defaultProps = {
    selectedSectionColor: 'rgba(255,255,255,0.5)',
    needTransitionTitle: false
  };

  constructor (props: Props) {
    super(props)

    this.state = {
      idx: this.props.selectedSegment || 0,
      anim: new Animated.Value(0),
      stickyHeaderHeight: 0
    };
    (this: any).handleSelectSegment = this.handleSelectSegment.bind(this)
  }

  render () {
    let segments = React.Children.map(this.props.children, child => child.props.title)

    // segments 的指示器
    let stickyHeader = null
    if (segments.length > 1) {
      stickyHeader = (
        <View style={styles.segmentTabWrapper}>
          <SegmentTab
            data={segments}
            titleSize={12}
            borderRadius={13.5}
            horizontalHeight={27}
            horizontalWidth={160}
            selected={this.state.idx}
            activeColor={this.props.selectedSectionColor}
            onPress={this.handleSelectSegment}
          />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Image source={this.props.backgroundImage} style={styles.headerWrapper}>
          {this.renderHeader()}
          {this.renderParallaxContent()}
          {stickyHeader}
        </Image>
        <ViewPager
          count={segments.length}
          selectedIndex={this.state.idx}
          onSelectedIndexChange={this.handleSelectSegment}>
          {this.props.children}
        </ViewPager>
      </View>
    )
  }

  renderParallaxContent () {
    if (this.props.parallaxContent) {
      return this.props.parallaxContent
    }
    return (
      <Text style={styles.parallaxText}>
        {this.props.androidTitle}
      </Text>
    )
  }

  renderHeader = () => {
    const {actionName, actionFunc, androidTitle} = this.props
    return (
      <NavBar
        backIconHidden
        title={androidTitle}
        titleStyle={styles.headerTitle}
        actionTextColor='white'
        actionName={actionName}
        actionFunc={actionFunc}
        barTintColor='transparent'
        barWrapperStyle={styles.barStyle}
        barBottomThickness={0}
        backFunc={() => navigator.pop()}
       />
    )
  };

  handleSelectSegment (idx: number) {
    if (this.state.idx !== idx) {
      const {onSegmentChange} = this.props
      this.setState({idx}, () => onSegmentChange && onSegmentChange(idx))
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  segmentTabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 7,
    left: 0,
    right: 0
  },
  barStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },
  headerWrapper: {
    height: 250,
    width: null,
    paddingTop: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 19
  },
  parallaxText: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: -1
  }
})
