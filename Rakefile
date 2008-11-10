require 'rubygems'
begin
  require 'rake'
rescue LoadError
  puts 'This script should only be accessed via the "rake" command.'
  puts 'Installation: gem install rake -y'
  exit
end
require 'rake'
require 'rake/clean'
require 'rake/packagetask'

$:.unshift File.dirname(__FILE__) + "/lib"

APP_VERSION  = '0.2.2'
APP_NAME     = 'monkeytest'

RUBYFORGE_PROJECT = APP_NAME
APP_FILE_NAME= "MonkeyTest.js"

APP_ROOT     = File.expand_path(File.dirname(__FILE__))
APP_SRC_DIR  = File.join(APP_ROOT, 'js')
APP_DIST_DIR = File.join(APP_ROOT, 'dist')
APP_PKG_DIR  = File.join(APP_ROOT, 'pkg')

DEPLOY_ROOT = "/var/web/projects/#{APP_NAME}"
ON_DEPLOY_RESTART = []
APP_SERVER = "linode.gandrew.com"

task :default => [:dist, :package, :clean_package_source]

Dir['tasks/**/*.rake'].each { |rake| load rake }




