Rails.application.routes.draw do
  root 'map#index'
  get 'about', to: 'about#index'
  get 'map', to: 'map#index'
  get 'map/tags/:level', to: "map#tags"
  get "map/legends/:level", to: "map#legends"
  get 'map/search', to: "map#search"
  get 'map/location/:id', to: "map#location"
  get 'map/details/:id', to: "map#details"
  get 'map/direction', to: "map#direction"
end
