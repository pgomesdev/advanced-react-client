import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import Nav from '../components/Nav'
import { CURRENT_USER_QUERY } from '../components/User'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeUser, fakeCartItem } from '../lib/testUtils'

describe('<Nav />', () => {
  const notSignedInMocks = [
    {
      request: { query: CURRENT_USER_QUERY },
      result: { data: { me: null } },
    }
  ]

  const signedInMocks = [
    {
      request: { query: CURRENT_USER_QUERY },
      result: { data: { me: fakeUser() } },
    }
  ]

  const signedInMocksWithCartItems = [
    {
      request: { query: CURRENT_USER_QUERY },
      result: {
        data: {
          me: {
            ...fakeUser(),
            cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()]
          },
        },
      },
    }
  ]

  it('renders a minimal nav when signed out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    )

    await wait()

    wrapper.update()

    const nav = wrapper.find('ul[data-test="nav"]')

    expect(toJSON(nav)).toMatchSnapshot()
    expect(nav.find('[href="/items"]').exists()).toBe(true)
    expect(nav.find('[href="/signup"]').exists()).toBe(true)
    expect(nav.find('[href="/me"]').exists()).toBe(false)
  })

  it('renders full nav when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    )

    await wait()

    wrapper.update()

    const nav = wrapper.find('ul[data-test="nav"]')

    expect(nav.children().length).toBe(6)
    expect(nav.find('[href="/items"]').exists()).toBe(true)
    expect(nav.find('[href="/sell"]').exists()).toBe(true)
    expect(nav.find('[href="/orders"]').exists()).toBe(true)
    expect(nav.find('[href="/me"]').exists()).toBe(true)
  })

  it('renders the amount of items in the cart', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav />
      </MockedProvider>
    )

    await wait()

    wrapper.update()

    const nav = wrapper.find('ul[data-test="nav"]')

    expect(nav.find('CartCount').text()).toEqual('9')
  })
});
