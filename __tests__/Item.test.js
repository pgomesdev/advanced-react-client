import ItemComponent from '../components/Item'
import { shallow, mount } from 'enzyme'
import formatMoney from '../lib/formatMoney'
import toJSON from 'enzyme-to-json'

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 5000,
  description: 'This item is really cool!',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg',
}

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)

    expect(toJSON(wrapper)).toMatchSnapshot()
  })
  // const wrapper = shallow(<ItemComponent item={fakeItem} />)

  // it('renders the image properly', () => {
  //   const img = wrapper.find('img')

  //   expect(img.props().src).toBe(fakeItem.image)
  //   expect(img.props().alt).toBe(fakeItem.title)
  // })

  // it('renders the price tag and title properly', () => {
  //   const PriceTag = wrapper.find('PriceTag')

  //   expect(PriceTag.children().text()).toBe(formatMoney(fakeItem.price))
  //   expect(wrapper.find('Title a').text()).toBe(fakeItem.title)
  // })

  // it('renders out the buttons properly', () => {
  //   const buttonList = wrapper.find('.buttonList')

  //   expect(buttonList.children()).toHaveLength(3)
  //   expect(buttonList.find('Link').exists()).toBe(true)
  //   expect(buttonList.find('AddToCart').exists()).toBe(true)
  //   expect(buttonList.find('DeleteItem').exists()).toBe(true)
  // })
});
