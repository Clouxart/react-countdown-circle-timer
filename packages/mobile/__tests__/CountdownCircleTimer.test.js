import React from 'react'
import { Text } from 'react-native'
import renderer from 'react-test-renderer'
import { render, waitFor } from '@testing-library/react-native'

import { CircleTimer } from '../src'

Math.random = () => 0.124578

const fixture = {
  duration: 10,
  colors: [
    ['#004777', 0.33],
    ['#F7B801', 0.33],
    ['#A30000', 0.33],
  ],
}

describe('snapshot tests', () => {
  it('renders', () => {
    const tree = renderer.create(<CircleTimer {...fixture} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders with time', () => {
    const tree = renderer
      .create(
        <CircleTimer
          {...fixture}
          renderAriaTime={({ remainingTime }) => remainingTime}
        >
          {({ remainingTime }) => <Text>{remainingTime}</Text>}
        </CircleTimer>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders with single color', () => {
    const tree = renderer
      .create(
        <CircleTimer duration={5} colors={[['#004777', 1]]}>
          {({ remainingTime }) => <Text>{remainingTime}</Text>}
        </CircleTimer>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders with single color provided as a string', () => {
    const tree = renderer
      .create(
        <CircleTimer duration={5} colors="#004777">
          {({ remainingTime }) => <Text>{remainingTime}</Text>}
        </CircleTimer>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders with gradient', () => {
    const tree = renderer
      .create(
        <CircleTimer
          duration={5}
          colors={[
            ['#004777', 0.4],
            ['#aabbcc', 0.6],
          ]}
          isLinearGradient
        >
          {({ remainingTime }) => <Text>{remainingTime}</Text>}
        </CircleTimer>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders with different trail stroke width', () => {
    const tree = renderer
      .create(
        <CircleTimer
          {...fixture}
          trailStrokeWidth={16}
          strokeWidth={14}
        >
          {({ remainingTime }) => <Text>{remainingTime}</Text>}
        </CircleTimer>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when color duration is not provided', () => {
    const tree = renderer
      .create(
        <CircleTimer
          {...fixture}
          colors={[['#047'], ['#aaa'], ['#bbb']]}
        >
          {({ remainingTime }) => <Text>{remainingTime}</Text>}
        </CircleTimer>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})

describe('functional tests', () => {
  it('should start the timer from value provided in initialRemainingTime', () => {
    const { getByText } = render(
      <CircleTimer {...fixture} initialRemainingTime={3.7}>
        {({ remainingTime }) => <Text>{remainingTime}</Text>}
      </CircleTimer>
    )

    expect(getByText('4')).toBeTruthy()
  })
})

describe('behaviour tests', () => {
  it('should call onComplete at the end of the countdown', async () => {
    const onComplete = jest.fn()
    const { findByText } = render(
      <CircleTimer
        {...fixture}
        duration={1}
        isPlaying
        onComplete={onComplete}
      >
        {({ remainingTime }) => <Text>{remainingTime}</Text>}
      </CircleTimer>
    )

    expect(await findByText('0')).toBeTruthy()
    expect(onComplete).toHaveBeenCalledWith(1)
  })

  it('should clear repeat timeout when the component is unmounted', () => {
    const clearTimeoutMock = jest.fn()

    global.clearTimeout = clearTimeoutMock

    const { unmount } = render(<CircleTimer {...fixture} />)

    unmount()

    expect(clearTimeoutMock).toHaveBeenCalled()
  })
})
