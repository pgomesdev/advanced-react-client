import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser } from '../lib/testUtils'
import { ApolloConsumer } from 'react-apollo';

function type (wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate('change', {
    target: { name, value },
  })
}

describe('<SignUp />', () => {
  const me = fakeUser()
  const mocks = [
    // signup mock
    {
      request: {
        query: SIGNUP_MUTATION,
        variables: {
          email: me.email,
          name: me.name,
          password: '123456',
        },
      },
      result: {
        data: {
          signup: {
            __typename: 'User',
            id: 'abc123',
            email: me.email,
            name: me.name,
          },
        },
      },
    },
    // current user query mock
    {
      request: {
        query: CURRENT_USER_QUERY,
      },
      result: {
        data: {
          me,
        }
      },
    },
  ]

  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    )

    expect(toJSON(wrapper.find('form'))).toMatchSnapshot()
  });

  it('calls the mutation properly', async () => {
    let apolloClient

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client

            return <SignUp />
          }}
        </ApolloConsumer>
      </MockedProvider>
    )

    await wait()

    wrapper.update()

    type(wrapper, 'name', me.name)
    type(wrapper, 'email', me.email)
    type(wrapper, 'password', '123456')

    wrapper.update()

    wrapper.find('form').simulate('submit')

    await wait()

    // query the user out of tha apollo client
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY })

    expect(user.data.me).toMatchObject(me)
  });
});
