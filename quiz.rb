require 'bundler'
Bundler.require(:default, :development)

get '/' do
  "hello world"
end
