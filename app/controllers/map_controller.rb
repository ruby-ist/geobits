class MapController < ApplicationController

  include MapHelper

  def index
    if params["level"]
      @level = params["level"]
      @left = params["left"]
      @top = params["top"]
      @pinned = params["pin"]
    else
      @level = 4
      @left = 1950
      @top = 1800
      @pinned = false
    end
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
    load "#{Rails.root}/lib/assets/zoom_level_4.rb"
    buildings = guides[:buildings]
    tags = place_tags[:tags]
    arr = []
    query = formatted params["query"]
    buildings.each do |hash|

      hash[:terms].each do |i|
        if formatted(i).include? query
          arr << { id: hash[:id], name: hash[:name], match: i, floor: "tagged", floor_no: 0 }
        end
      end

      hash[:floors].each do |floor|
        floor[:rooms].each do |i|
          if formatted(i).include? query
            arr << { id: hash[:id], name: hash[:name], match: i, floor: floor[:name], floor_no: hash[:floors].index(floor) }
          end
        end
      end
    end

    tags.each do |tag|
      if formatted(tag[:name]).include? query
        arr << {id: tag[:id], name: tag[:name], match: tag[:name], floor: "tagged", floor_no: 0}
      end
    end

    arr.sort_by! { |i| formatted(i[:match]).index(query) }

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

  def direction
    load "#{Rails.root}/lib/assets/junction_points.rb"
    points = junctions
    from = points.find{ |point| point[:surroundings].include? params["from"] }[:id]
    to = points.find{ |point| point[:surroundings].include? params["to"] }[:id]

    graph = Map.new
    render json: graph.route(from, to)
  end

  private

  def formatted(str)
    str.downcase.gsub(' ', '')
  end

end
