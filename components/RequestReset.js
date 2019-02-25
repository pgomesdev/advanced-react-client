import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
  ) {
    requestReset(
      email: $email
    ) {
      message
    }
  }
`

class RequestReset extends Component {
  state = {
    email: '',
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
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
      >
        {(requestReset, { error, loading, called }) => {
          return (
            <Form method='POST' onSubmit={async (e) => {
              e.preventDefault()

              await requestReset()

              this.setState(() => ({
                email: '',
              }))
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a password reset</h2>
                <ErrorMessage error={error} />
                {!error && !loading && called && <p>Success check your email for a reset link</p>}
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
                <button type='submit'>Request Reset!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default RequestReset
