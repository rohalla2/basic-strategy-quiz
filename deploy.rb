require 'aws-sdk'
require 'yaml'

# `ruby app.rb` # DO THIS MANUALLY FOR NOW

# make the dist folder
`mkdir dist`

# Iterate over each page in the app and save the html file
[
  {route: '/', filename: 'index.html'},
  {route: '/start.html', filename: 'start.html'},
].each do |route_info|
  `curl -o dist/#{route_info[:filename]} http://localhost:9393#{route_info[:route]}`
end

# generate  minified css from the sass
`sass -t compressed public/styles.scss:dist/styles.css`
`rm dist/styles.css.map`
`cp public/questions.json dist`
`cp public/bootstrap.min.css dist`

# minifiy the js # FOR NOW, JUST COPY IT
`cp public/script.js dist`

cred = YAML.load_file('aws.yml')

Aws.config.update({
  region: 'us-east-1',
  credentials: Aws::Credentials.new(cred['ACCESS_KEY_ID'], cred['SECRET_ACCESS_KEY'])
})
Aws.use_bundled_cert!

s3 = Aws::S3::Resource.new
bucket = s3.bucket('strategy.jeffrohalla.com')


Dir.chdir('dist')
Dir.glob("**/*").each do |file|
  next if File.directory?(file)
  puts "uploading #{file}..."
  if file.end_with?(".css")
    content_type = 'text/css'
  end

  obj = bucket.object(file)
  obj.upload_file(file, {acl: 'public-read', content_type: content_type})
end
# obj = s3.bucket('bucket-name'). object('key')
# obj.upload_file('/path/to/source/file')

## Deploy to S3
# upload all files
# allow public permissions on files

Dir.chdir('..')
`rm -r dist`
