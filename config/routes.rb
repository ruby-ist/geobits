Rails.application.routes.draw do
  root 'map#index'
  get 'map', to: 'map#index'
  get 'map/tags/:level', to: "map#tags"
end
