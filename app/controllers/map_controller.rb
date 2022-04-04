class MapController < ApplicationController

  def index
  end

  def tags
    load "#{Rails.root}/lib/assets/zoom_level_#{params[:level]}.rb"
    tags = place_tags
    render json: tags
  end

  def search
    load "#{Rails.root}/lib/assets/index.rb"
    buildings = guides[:buildings]
    arr = []
    buildings.each do |hash|
      hash[:floors].each { |i| hash[:terms] += i[:rooms] }
      hash[:terms].each do |i|
        if i.downcase.include? params["query"].downcase
          arr << {name: hash[:name], match: i}
        end
      end
    end
    render json: arr
  end



end
