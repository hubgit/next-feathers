import React from 'react'
import Head from 'next/head'
import { Button, Container, Form, Header, Icon, List, Modal } from 'semantic-ui-react'
import feathers from '../feathers-client'

const service = feathers.service('articles')

class ArticlesList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      articles: null,
      editing: false,
      title: ''
    }
  }

  componentDidMount () {
    this.subscriber = service.watch().find().subscribe(articles => this.setState({ articles }))
  }

  componentWillUnmount () {
    this.subscriber.unsubscribe()
  }

  startEditing = () => {
    this.setState({editing: true})
  }

  stopEditing = () => {
    this.setState({editing: false, title: ''})
  }

  setTitle = event => {
    this.setState({ title: event.target.value })
  }

  createArticle = event => {
    const { title } = this.state
    service.create({ title }).then(this.stopEditing)
  }

  removeArticle = id => () => {
    service.remove(id)
  }

  render () {
    const { articles, editing, title } = this.state

    return (
      <div>
        <Head>
          <title>Feathers + Next.js</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
        </Head>

        <Container>
          <Header size={'large'} style={{margin: '30px 0'}}>Articles</Header>

          <List>
            {articles && articles.data.map(article => (
              <List.Item key={article._id}>
                <List.Content floated={'right'}>
                  <Button icon onClick={this.removeArticle(article._id)}>
                    <Icon name={'remove'}/>
                  </Button>
                </List.Content>

                <List.Content>
                  {article.title}
                </List.Content>
              </List.Item>
            ))}
          </List>

          <Button icon circular size={'huge'} color={'blue'} onClick={this.startEditing}>
            <Icon name={'plus'}/>
          </Button>

          <Modal onClose={this.stopEditing} open={editing}>
            <Modal.Header>Add an article</Modal.Header>

            <Modal.Content scrolling>
              <Form>
                <Form.Field>
                  <label>Title</label>
                  <input
                    type={'text'}
                    name={'title'}
                    required
                    autoFocus
                    value={title}
                    onChange={this.setTitle}
                  />
                </Form.Field>
              </Form>
            </Modal.Content>

            <Modal.Actions>
              <Button primary onClick={this.createArticle}>Save</Button>
              <Button onClick={this.stopEditing}>Cancel</Button>
            </Modal.Actions>
          </Modal>
        </Container>
      </div>
    )
  }
}

export default ArticlesList
