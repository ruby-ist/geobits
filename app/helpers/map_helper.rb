module MapHelper
    class Map
        def initialize(type)
            @type = type
        end

        def route(src, des)
            if @type == "pedestrian"
                load "#{Rails.root}/lib/assets/edges.rb"
            elsif @type == "vehicle"
                load "#{Rails.root}/lib/assets/vehicle_edges.rb"
            end
            edges = calculated_edges
            graph = Dijkstra::Trace.new(edges)
            process_path graph.path(src,des)
        end

        def process_path(path)
            if @type == "pedestrian"
                load "#{Rails.root}/lib/assets/junction_points.rb"
            elsif @type == "vehicle"
                load "#{Rails.root}/lib/assets/vehicle_junction_points.rb"
            end
            points = junctions
            first = points.find{|i| i[:id] == path.path.first}
            last = points.find{|i| i[:id] == path.path.last}

            result = {"distance": path.distance,
                      "path": [],
                      "starting-point": {
                          "x": first[:left],
                          "y": first[:top]
                      },
                      "ending-point": {
                          "x": last[:left],
                          "y": last[:top]
                      }}

            path.path.each do |vertex|
                vertex = vertex.to_s
                vertex = "0" * (3 - vertex.length) + vertex
                result[:path] << vertex
            end
            result
        end

        def distance(x1, y1, x2, y2)
            Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
        end

        def nearest_junction(long, lat)
            if @type == "pedestrian"
                load "#{Rails.root}/lib/assets/junction_points.rb"
            elsif @type == "vehicle"
                load "#{Rails.root}/lib/assets/vehicle_junction_points.rb"
            end
            points = junctions
            min = 9999999
            id = 0
            points.each do |point|
                dist = distance(point[:left], point[:top], long, lat)
                if dist < min
                    min = dist
                    id = point[:id]
                end
            end
            id
        end
    end
end
