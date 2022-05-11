class MapController < ApplicationController

  def index

  end

  def tags
    load "#{Rails.root}/lib/assets/zoom_level_#{params[:level]}.rb"
    tags = place_tags
    render json: tags
  end

  def legends
    load "#{Rails.root}/lib/assets/legends_#{params[:level]}.rb"
    render json: place_legends
  end

  def search
    load "#{Rails.root}/lib/assets/index.rb"
    buildings = guides[:buildings]
    arr = []
    query = formatted params["query"]
    buildings.each do |hash|

      hash[:terms].each do |i|
        if formatted(i).include? query
          arr << { id: hash[:id], name: hash[:name], match: i, floor: "tagged" }
        end
      end

      hash[:floors].each do |floor|
        floor[:rooms].each do |i|
          if formatted(i).include? query
            arr << { id: hash[:id], name: hash[:name], match: i, floor: floor[:name] }
          end
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
    load "#{Rails.root}/lib/assets/zoom_level_#{params[:level]}.rb"
    buildings = guides[:buildings]
    buildings.each do |hash|
      if hash[:id] == params[:id]
        render json: hash
        return
      end
    end
    tags = place_tags[:tags]
    place = tags.detect{ |i| i[:id] == params[:id] }
    render json: {"name": place[:name], "main": place[:name], "floors": [ {"name": "Ground", "rooms": [ place[:name] ] } ] }
  end

  private

  def formatted(str)
    str.downcase.gsub(' ', '')
  end

end
