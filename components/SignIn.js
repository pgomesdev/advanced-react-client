import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION(
    $email: String!,
    $password: String!
  ) {
    signin(
      email: $email,
      password: $password
    ) {
      id
      name
      email
    }
  }
`

class SignIn extends Component {
  state = {
    email: '',
    password: '',
  }

  handleChange = (e) => {
    const { name, value } = e.target

    this.setState(() => ({
      [name]: value,
    }))
  }

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY }
        ]}
      >
        {(signin, { error, loading }) => {
          return (
            <Form method='POST' onSubmit={async (e) => {
              e.preventDefault()

              const res = await signin()

              this.setState(() => ({
                email: '',
                password: '',
              }))
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign In</h2>
                <ErrorMessage error={error} />
                <label htmlFor='email'>
                  Email
                  <input
                    type='email'
                    name='email'
                    placeholder='email'
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </label>
                <label htmlFor='password'>
                  Password
                  <input
                    type='password'
                    name='password'
                    placeholder='password'
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </label>
                <button type='submit'>Sign In!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default SignIn
