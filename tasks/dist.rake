
desc "Builds the distribution"
task :dist do
  $:.unshift File.join(APP_ROOT, 'lib')
  require 'protodoc'
  require 'fileutils'
  FileUtils.mkdir_p APP_DIST_DIR

  Dir.chdir(APP_SRC_DIR) do
    File.open(File.join(APP_DIST_DIR, "#{APP_NAME}.js"), 'w+') do |dist|
      dist << Protodoc::Preprocessor.new(APP_FILE_NAME)
    end
  end
  Dir.chdir(APP_DIST_DIR) do
    FileUtils.copy_file "#{APP_NAME}.js", "#{APP_NAME}-#{APP_VERSION}.js"
  end
  if File.directory?("website")
    FileUtils.mkdir_p "website/dist"
    FileUtils.copy_file "dist/#{APP_NAME}.js",       "website/dist/#{APP_NAME}.js"
    FileUtils.copy_file "dist/#{APP_NAME}.js",       "website/dist/#{APP_NAME}-#{APP_VERSION}.js"
  end
end

Rake::PackageTask.new(APP_NAME, APP_VERSION) do |package|
  package.need_tar_gz = true
  package.package_dir = APP_PKG_DIR
  package.package_files.include(
    '[A-Z]*',
    'config/*.sample',
    "dist/#{APP_FILE_NAME}",
    'lib/**',
    'src/**',
    'script/**',
    'tasks/**',
    'test/**',
    'website/**'
  )
end


task :clean_package_source do
  rm_rf File.join(APP_PKG_DIR, "#{APP_NAME}-#{APP_VERSION}")
end
