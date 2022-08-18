edges = []
# use the same for paths vehicle.svg to calculate vehicle edges
File.open("app/assets/images/paths.svg").each do |line|
    if line =~ /J[0-9]{6}/
        edges << line.match(/J([0-9]{3})([0-9]{3})/).captures.map(&:to_i)
    end
end
pp edges

puts "\nPaste the output in edge_calculator.rb"