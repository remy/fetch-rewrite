# Rewrite Fetch

This small library will let you apply rewrite rules to fetch commands.

This is useful for "fixing" other people's code (or perhaps for testing). My specific use case was to modify the response payloads for the Spotify app so that I could remove episodes and audiobooks by modifying the fetch responses.

## TODO

- [ ] Method matching
- [ ] Deeper URL matching (i.e. on origin too)
- [ ] Pattern match/regex support on URL match
- [ ] Tests
- [ ] Actually include more documentation and examples
