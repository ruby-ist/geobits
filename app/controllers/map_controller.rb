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
          arr << { id: hash[:id], name: hash[:name], match: i}
        end
      end
    end
    render json: arr
  end

  def location
    load  "#{Rails.root}/lib/assets/zoom_level_4.rb"
    tags = place_tags[:tags]
    place = tags.detect {|i| i[:id] == params[:id]}
    render json: place
  end

  def details
    load "#{Rails.root}/lib/assets/index.rb"
    buildings = guides[:buildings]
    buildings.each do |hash|
      if hash[:id] == params[:id]
        render json: hash
        return
      end
    end
    render json: []
  end

end
