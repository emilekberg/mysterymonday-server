pipeline {
  agent any
  stages {
    stage('Precompile') {
      parallel {
        stage('Install dependencies') {
          steps {
            sh 'npm install'
          }
        }
        stage('clean up bin folder') {
          steps {
            sh 'rm rf ./bin'
          }
        }
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Postcompile') {
      parallel {
        stage('Publish test result') {
          steps {
            junit 'test-results.xml'
          }
        }
        stage('Publish artifacts') {
          steps {
            archiveArtifacts './bin/**/*.js'
          }
        }
      }
    }
  }
}