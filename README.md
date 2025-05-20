# log-visualizer

This is a visualizer for CS:GO match logs.

## 1. Introduction

I tried out node.js for the backend.

## 2. Modeling

I like flat data, so I decided that the main thing the backend serves is the 9171 log entries. I enrich them and add some additional resources for, e.g., teams and players.

I parse the file in two passes.
#### 1. Read and identify a type for each log-entry
#### 2. Enrich and add team and player resources.

## 3. Cut corners

Listing some corners I cut to focus on the more interesting things.

### No database
- I use a memory cache to save the result of reading the file and of parsing it.
### Assuming player- and team-tags are unique
- So I can use them as ids.
### Models
- I'll use domain-models in the backend data- and api-layers to save time.
### Message types 
- Parsing functionality not robust for other log-files. E.g. admin messages seem to be able to be prefixed with weird random chars (wonder what these are...?).
- The categorization into types would likely benefit from a better understanding of CS:GO. 