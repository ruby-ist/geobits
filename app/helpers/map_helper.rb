module MapHelper
    class Map
        def route(src, des)
            load "#{Rails.root}/lib/assets/edges.rb"
            edges = calculated_edges
            graph = Dijkstra::Trace.new(edges)
            process_path graph.path(src,des)
        end

        def process_path path
            result = {"source": path.starting_point, "destination": path.ending_point, "distance": path.distance, "path": []}

            path.path.each do |vertex|
                vertex = vertex.to_s
                vertex = "0" * (3 - vertex.length) + vertex
                result[:path] << vertex
            end
        end
    end
end
