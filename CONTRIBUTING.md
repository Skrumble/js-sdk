### Documentation
There are separate NPM tasks for generating and serving docs. To generate the docs, run `npm run docs`, which will read the code in `src/` and output it to `docs/`. 

To view it in a browser using SimpleHTTPServer, run `npm run docs_serve`. The docs should now be visible at [localhost:5000/index.html](http://localhost:5000/index.html)

### Testing
The SDK currently uses mocha/chai as a testing suite. `npm run test` will run the tests and output results to the console. 

### Roadmap
The goal of the SDK is to provide convenient access to the full functionality of the [Skrumble Communication API](http://developers.skrumble.com/api-reference/). For maintainers/contributors, unchecked items below are unimplemented, and therefore a good place to start contributing. **Bold items** are high-priority features. See our list of [Github Issues](https://github.com/Skrumble/js-sdk/issues) for information about individual features.

- [ ] Teams
    - [x] Create team
    - [x] Update team info
- [ ] Users
    - [x] Create user (add to team)
    - [x] Update user info
    - [x] Invite user
    - [x] Invite guest
    - [x] Get one
    - [x] Get all
    - [x] Check existing
    - [x] User login
    - [x] Guest login
    - [ ] Deactivate user
    - [ ] Register device for notification
    - [ ] Deregister device for notification
- [ ] Chat
    - [x] Create
    - [x] Get one
    - [x] Get all
    - [ ] **Update chat info**
    - [x] Delete chat
    - [x] Generate guest url
    - [x] Mark as read
    - [x] Add user to group
    - [x] Remove user from group
    - [ ] Messages
        - [x] Send/recieve messages
        - [ ] Send file by URL
        - [ ] **Send file by data**
        - [ ] **Get unread**
        - [x] Translate message
    - [ ] Links
        - [ ] Get links by chat
        - [ ] Get links for user
    - [ ] Files
        - [ ] Get files by chat
        - [ ] Get files for user
        - [ ] Get file info 
- [ ] Integrations
    - [ ] Integration type support:
        - [ ] Google
        - [ ] Office365
        - [ ] Exchange
    - [ ] Create integration
    - [ ] Update integration
    - [ ] Delete integration
    - [ ] Contacts
        - [ ] Create contact
        - [ ] Update contact
        - [ ] Delete contact
        - [ ] Get one 
        - [ ] Get all
    - [ ] Events
        - [ ] Add event
        - [ ] Update event
        - [ ] Delete event 
        - [ ] Get all 
        - [ ] Get one
