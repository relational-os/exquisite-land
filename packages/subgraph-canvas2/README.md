# exquisite land subgraph

debug command (go to https://lucasconstantino.github.io/graphiql-online/) set the endpoint as
https://api.thegraph.com/index-node/graphql
and paste this

```graphql
{
  indexingStatusForCurrentVersion(
    subgraphName: "relational-os/exquisite-land"
  ) {
    synced
    health
    fatalError {
      message
      block {
        number
        hash
      }
      handler
    }
    chains {
      chainHeadBlock {
        number
      }
      latestBlock {
        number
      }
    }
  }
}
```
