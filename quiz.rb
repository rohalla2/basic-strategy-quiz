require 'bundler'
require 'json'

Bundler.require(:default, :development)

Tilt.register Tilt::ERBTemplate, 'html.erb'

def get_randomized_questions
  json_file = File.read('questions.json')
  questions = JSON.parse(json_file)
  questions.shuffle!
end

get '/' do
  erb :index
end

get '/start.html' do
  # @questions = get_randomized_questions
  erb :quiz
end
