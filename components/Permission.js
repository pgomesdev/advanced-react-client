import React, { Component, Fragment } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'
import PropTypes from 'prop-types'

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
]

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission],
    $userId: ID!
  ) {
    updatePermissions(
      permissions: $permissions,
      userId: $userId
    ) {
      id
      name
      email
      permissions
    }
  }
`

const Permission = (props) => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => <UserPermission key={user.id} user={user} />)}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
)

class UserPermission extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  }

  state = {
    permissions: [],
  }

  handlePermissionChange = (e) => {
    const { permissions } = this.state
    const checkbox = e.target

    let newPermissionsArray = [];

    if (checkbox.checked) {
      newPermissionsArray = [...permissions, checkbox.value]
    } else {
      newPermissionsArray = permissions.filter(permission => permission !== e.target.value)
    }

    this.setState(() => ({
      permissions: newPermissionsArray,
    }))
  }

  componentDidMount() {
    this.setState(() => ({
      permissions: this.props.user.permissions,
    }))
  }

  render() {
    const { user } = this.props
    const { permissions } = this.state

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: permissions,
          userId: user.id,
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <Fragment>
            {error && <tr><td colspan='8'><Error error={error} /></td></tr>}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={permission}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type='checkbox'
                      checked={permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type='button'
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  UPDAT{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </Fragment>
        )}
      </Mutation>
    )
  }
}

export default Permission
