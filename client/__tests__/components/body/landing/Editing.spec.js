import React from 'react';
import { shallow } from 'enzyme';
import Editing from '../../../../components/body/landing/Editing';

describe('Landing column 1', () => {
  const wrapper = shallow(
    <Editing />
  );
  it('renders', () => {
    expect(wrapper.find('#home1'))
    .toHaveLength(1);
  });
});
