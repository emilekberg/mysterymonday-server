# mysterymonday-server

## database-design
users
- name
- password
- hash

restaurants: 
- name

groups:
- users
- restaurants

reviews:
- restaurant_id
- reviewer
- comment
- score
  - taste
  - service
  - cozyness
  - cost
  - average

