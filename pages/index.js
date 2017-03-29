import React, { Component } from 'react'
import feathers from '../feathers-client'
import {
  Dialog,
  FlatButton,
  FloatingActionButton,
  IconButton,
  List,
  ListItem,
  Toolbar,
  ToolbarTitle
} from 'material-ui'
import { FormsyText } from 'formsy-material-ui'
import { Form } from 'formsy-react'
import ContentAddIcon from 'material-ui/svg-icons/content/add'
import ContentRemoveIcon from 'material-ui/svg-icons/content/remove'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

try {
  injectTapEventPlugin()
} catch (e) {}

const service = feathers.service('/api/articles')

export default class ArticlesList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      articles: null,
      editing: false
    }
  }

  componentDidMount () {
    this.subscriber = service.find().subscribe(articles => this.setState({ articles }))
  }

  componentWillUnmount () {
    this.subscriber.unsubscribe()
  }

  startEditing = () => {
    this.setState({editing: true})
  }

  stopEditing = () => {
    this.setState({editing: false})
    this.editForm.reset()
  }

  createArticle = data => {
    service.create(data).then(this.stopEditing)
  }

  removeArticle = id => {
    service.remove(id)
  }

  render () {
    const { articles, editing } = this.state

    return (
      <MuiThemeProvider>
        <div style={{fontFamily: 'sans-serif'}}>
          <Toolbar>
            <ToolbarTitle text="Articles"/>
          </Toolbar>

          <List style={{margin: 30}}>
            {articles && articles.data.map(article => (
              <ListItem
                key={article.id}
                primaryText={article.title}
                rightIconButton={
                  <IconButton onClick={() => this.removeArticle(article.id)}>
                    <ContentRemoveIcon/>
                  </IconButton>
                }/>
            ))}
          </List>

          <FloatingActionButton onClick={this.startEditing} style={{margin: 30}}>
            <ContentAddIcon/>
          </FloatingActionButton>

          <Dialog
            title="Add an article"
            modal={false}
            open={editing}
            onRequestClose={this.stopEditing}
            actions={[
              <FlatButton label="Cancel" primary={false}
                          onClick={this.stopEditing} />,
              <FlatButton label="Save" primary={true}
                          onClick={() => this.editForm.submit()} />
            ]}>
            <Form onValidSubmit={this.createArticle} ref={form => (this.editForm = form)}>
              <FormsyText
                name="title"
                required
                autoFocus
                fullWidth={true}
                floatingLabelText="Title"/>
            </Form>
          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }
}
