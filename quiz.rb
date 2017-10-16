require 'sinatra'

Tilt.register Tilt::ERBTemplate, 'html.erb'

get '/' do
  erb :index
end

get '/start.html' do
  erb :quiz
end
