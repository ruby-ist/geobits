class MapController < ApplicationController
  def index
  end

  def tags
    load "#{Rails.root}/lib/assets/zoom_level_#{params[:level]}.rb"
    tags = place_tags
    render json: tags
  end

end
